import { Activity, SensorData, AlertType, Severity } from '../types';

/**
 * AI-powered ML Service for Elderly Monitoring
 */
export class MLService {
  // Thresholds for anomaly detection
  private static readonly HR_HIGH = 120;
  private static readonly HR_LOW = 40;
  private static readonly FALL_THRESHOLD = 15.0; // G-force magnitude

  /**
   * Recognizes activity based on sensor data.
   * In a real system, this would load a .pkl or .h5 model.
   */
  public static recognizeActivity(data: Partial<SensorData>): Activity {
    const { accel_x = 0, accel_y = 0, accel_z = 9.8, steps = 0, heart_rate = 70 } = data;
    
    // Calculate magnitude of acceleration
    const magnitude = Math.sqrt(accel_x ** 2 + accel_y ** 2 + accel_z ** 2);
    
    // 1. Fall Detection (Sudden impact)
    if (magnitude > this.FALL_THRESHOLD) {
      return 'Fall';
    }

    // 2. Walking (Steps increasing and significant movement)
    if (steps > 0 && magnitude > 10.5) {
      return 'Walking';
    }

    // 3. Sleeping (Low movement and low heart rate)
    if (magnitude < 10.1 && heart_rate < 55) {
      return 'Sleeping';
    }

    // 4. Default: Sitting
    return 'Sitting';
  }

  /**
   * Detects anomalies in behavior or health metrics.
   */
  public static detectAnomaly(data: SensorData): { isAnomaly: boolean; alertType?: AlertType; severity?: Severity; message?: string } {
    // 1. Heart Rate Anomaly
    if (data.heart_rate > this.HR_HIGH) {
      return {
        isAnomaly: true,
        alertType: 'High Heart Rate',
        severity: 'high',
        message: `Abnormally high heart rate detected: ${data.heart_rate} bpm.`
      };
    }

    // 2. Fall Detection
    if (data.activity === 'Fall') {
      return {
        isAnomaly: true,
        alertType: 'Fall Detected',
        severity: 'high',
        message: 'A potential fall has been detected. Immediate attention required.'
      };
    }

    // 3. No Movement (Simplified: would normally check historical data)
    // If sitting for a very long time with high heart rate, could be an issue
    if (data.activity === 'Sitting' && data.heart_rate > 100) {
      return {
        isAnomaly: true,
        alertType: 'Anomaly Detected',
        severity: 'medium',
        message: 'High heart rate while sedentary. Potential distress.'
      };
    }

    return { isAnomaly: false };
  }

  /**
   * Predicts mobility decline risk based on historical trends.
   */
  public static predictMobilityRisk(historicalData: SensorData[]): { riskLevel: 'low' | 'medium' | 'high'; indicator: string } {
    if (historicalData.length < 7) return { riskLevel: 'low', indicator: 'Insufficient data for prediction.' };

    const avgSteps = historicalData.reduce((acc, d) => acc + d.steps, 0) / historicalData.length;
    
    if (avgSteps < 500) return { riskLevel: 'high', indicator: 'Significant decline in daily mobility.' };
    if (avgSteps < 1500) return { riskLevel: 'medium', indicator: 'Moderate decline in daily activity levels.' };
    
    return { riskLevel: 'low', indicator: 'Mobility levels are stable.' };
  }
}
